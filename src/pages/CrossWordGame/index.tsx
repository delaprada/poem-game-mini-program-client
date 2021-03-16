import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtToast, AtButton, AtModal } from 'taro-ui';
import BeginGame from '@components/begin-game';
import questions from '@assets/question/crossword';
import { AnswerListType } from '@constants/commonType';

import './index.less';

function ChoiceGame(props) {
  const [qid, setQid] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [answerList, setAnswerList] = useState<AnswerListType>([]);
  const [correctNum, setCorrectNum] = useState<number>(0);
  const [wrongNum, setWrongNum] = useState<number>(0);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('');

  const handleBegin = () => {
    setShow(true);
  };

  const handleClick = (option) => {
    // 不能直接赋值，直接赋值两者内存地址相同，不会触发react的重新渲染
    const curList = answerList.slice();

    if (!curList[qid]) {
      if (option === questions[qid].answer) {
        setToastText('回答正确ヾ(≧▽≦*)o')
        setCorrectNum(correctNum + 1);

        curList.push({
          correct: option,
          wrong: '',
        });
        setAnswerList(curList);
      } else {
        setToastText('回答错误(；′⌒`)')
        setWrongNum(wrongNum + 1);

        curList.push({
          correct: questions[qid].answer,
          wrong: option,
        });
        setAnswerList(curList);
      }
    }

    setOpen(true);
  };

  const handlePre = () => {
    setOpen(false);
    const curQid = qid;
    setQid(curQid - 1);
  };

  const handleNext = () => {
    setOpen(false);
    if (qid === questions.length - 1) {
      setShowModel(true);
    } else {
      const curQid = qid;
      if (curQid + 1 === questions.length + 1) {
      }

      setQid(curQid + 1);
      setShowNext(false);
    }
  };

  const handleConfirm = () => {
    Taro.switchTab({
      url: '/pages/GameCenter/index',
    });
  };

  return (
    <View className="crossword-game-container">
      {show ? (
        <View className="crossword-game">
          <Text className="title">第{questions[qid].no}题</Text>
          <Text className="question">{questions[qid].stem}</Text>
          <View className="options">
            {questions[qid].options.map((item, index) => {
              return (
                <View
                  className="option"
                  onClick={() => handleClick(item.option)}>
                  <View
                    className={
                      answerList[qid]?.wrong === item.option
                        ? 'letter wrong'
                        : answerList[qid]?.correct === item.option
                        ? 'letter correct'
                        : 'letter'
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
          <AtToast isOpened={open} text={toastText} duration={2000}></AtToast>
        </View>
      ) : (
        <BeginGame clickBegin={handleBegin} />
      )}
    </View>
  );
}

export default React.memo(ChoiceGame);
