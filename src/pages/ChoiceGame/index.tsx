import React, { useEffect, useState } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon, AtButton, AtModal } from 'taro-ui';
import BeginGame from '@components/begin-game';
import questionStore from '@assets/question/choice';
import { quesType, AnswerListType } from '@constants/commonType';

import './index.less';

function ChoiceGame() {
  const [questions, setQuestions] = useState<Array<quesType>>([]);
  const [qid, setQid] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [answerList, setAnswerList] = useState<AnswerListType>([]); // 问题回答情况列表
  const [correctNum, setCorrectNum] = useState<number>(0);
  const [wrongNum, setWrongNum] = useState<number>(0);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(false);
  const [round, setRound] = useState<number>(0);

  useEffect(() => {
    const router = getCurrentInstance().router;
    if (router) {
      const { round: roundParam } = router.params;
      const round = Number(roundParam);
      setRound(round);
      setQuestions(questionStore[round - 1]);
    }
  }, []);

  const handleBegin = () => {
    setShow(true);
  };

  const handleClick = (option) => {
    // 不能直接赋值，直接赋值两者内存地址相同，不会触发react的重新渲染
    const curList = answerList.slice();

    if (!curList[qid]) {
      if (option === questions[qid].answer) {
        setCorrectNum(correctNum + 1);

        curList.push({
          correct: option,
          wrong: '',
        });
        setAnswerList(curList);
      } else {
        setWrongNum(wrongNum + 1);

        curList.push({
          correct: questions[qid].answer,
          wrong: option,
        });
        setAnswerList(curList);
      }
    }

    setShowNext(true);
  };

  const handlePre = () => {
    const curQid = qid;
    setQid(curQid - 1);
    setShowNext(false);
  };

  const handleNext = () => {
    if (qid === questions.length - 1) {
      setShowModel(true);
    } else {
      const curQid = qid;
      setQid(curQid + 1);
      setShowNext(false);
    }
  };

  const handleConfirm = () => {
    const game = Taro.getStorageSync('game');
    const choiceRound = game.choice;

    if (choiceRound <= round) {
      game.choice = round + 1;
      Taro.setStorageSync('game', game);
    }

    Taro.navigateTo({
      url: '/pages/Round/index?type=0',
    });
  };

  return (
    <View className="choice-game-container">
      {show ? (
        <View className="choice-game">
          <Text className="title">第{questions[qid].no}题</Text>
          <Text className="question">{questions[qid].stem}</Text>
          <View className="options">
            {questions[qid].options.map((item) => {
              return (
                <View
                  className="option"
                  onClick={() => handleClick(item.option)}>
                  <View className="tag">
                    {answerList[qid]?.wrong === item.option ? (
                      <AtIcon
                        prefixClass="fa"
                        value="times-circle-o"
                        size="20"
                        color="#F00"></AtIcon>
                    ) : answerList[qid]?.correct === item.option ? (
                      <AtIcon
                        prefixClass="fa"
                        value="check-circle-o"
                        size="20"
                        color="#597ef7"></AtIcon>
                    ) : (
                      item.option
                    )}
                  </View>
                  <View
                    className={
                      answerList[qid]?.wrong === item.option
                        ? 'wrong'
                        : answerList[qid]?.correct === item.option
                        ? 'correct'
                        : ''
                    }>
                    {item.content}
                  </View>
                </View>
              );
            })}
          </View>
          <View className="bottom">
            {showNext || answerList[qid] ? (
              <View className="buttons">
                {qid === 0 ? null : (
                  <AtButton
                    className="button"
                    type="primary"
                    onClick={handlePre}>
                    上一题
                  </AtButton>
                )}
                <AtButton
                  className="button"
                  type="primary"
                  onClick={handleNext}>
                  下一题
                </AtButton>
              </View>
            ) : null}
          </View>
          <View>
            {showModel ? (
              <AtModal
                isOpened
                title="游戏结束"
                confirmText="确认"
                onConfirm={handleConfirm}
                content={`答对：${correctNum}题\n\r答错：${wrongNum}题`}
              />
            ) : null}
          </View>
        </View>
      ) : (
        <BeginGame loadBegin={handleBegin} />
      )}
    </View>
  );
}

export default React.memo(ChoiceGame);
