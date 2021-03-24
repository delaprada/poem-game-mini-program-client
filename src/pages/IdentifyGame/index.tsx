import React, { useEffect, useState } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtToast, AtButton, AtModal } from 'taro-ui';
import BeginGame from '@components/begin-game';
import questionStore from '@assets/question/identification';
import { idenQuesType } from '@constants/commonType';

import './index.less';

function IdentifyGame() {
  const [questions, setQuestions] = useState<Array<idenQuesType>>([]); // 当前关卡题目列表
  const [qid, setQid] = useState<number>(0); // 题号
  const [show, setShow] = useState<boolean>(false); // 游戏是否开始 
  const [curIndex, setCurIndex] = useState<number>(0); // 记录当前输入第几个字
  const [answerList, setAnswerList] = useState<Array<Array<string>>>([]); // 答案列表
  const [confirmList, setConfirmList] = useState<Array<number>>([]); // 记录是否答完当前题目且回答是否正确
  const [correctNum, setCorrectNum] = useState<number>(0); // 正确题目数
  const [wrongNum, setWrongNum] = useState<number>(0); // 错误题目数
  const [showNext, setShowNext] = useState<boolean>(false); // 是否展示上一题下一题按钮
  const [showModel, setShowModel] = useState<boolean>(false); // 是否展示游戏结束弹窗
  const [open, setOpen] = useState<boolean>(false); // 是否展示toast
  const [toastText, setToastText] = useState<string>(''); // 设置toast内容
  const [round, setRound] = useState<number>(0);  // 第几关卡

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

  const handleClick = (index) => {
    const ansLen = questions[qid].answer.length;
    let curList: any = answerList.slice();
    const confirm = isConfirm();

    if (!confirm) {
      if (!curList[qid]) {
        // 初始化为一定长度的数组，使得填的字能够从左到右放置
        curList[qid] = Array(ansLen).fill('');
      }

      curList[qid][curIndex] = index;
      setAnswerList(curList);
      setCurIndex(curIndex + 1);

      // 当填的字数与答案字数长度相同时
      if (curIndex === ansLen - 1) {
        // 记录已经答完当前题目且回答情况
        const curConfirmList = confirmList.slice();

        if (
          JSON.stringify(curList[qid]) === JSON.stringify(questions[qid].answer)
        ) {
          setToastText('回答正确');
          setOpen(true);
          setCorrectNum(correctNum + 1);
          curConfirmList.push(1);
        } else {
          setToastText('回答错误');
          setOpen(true);
          setWrongNum(wrongNum + 1);
          curConfirmList.push(0);
        }

        setConfirmList(curConfirmList);
        setShowNext(true);
      }
    }
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
      setQid(curQid + 1);
      setCurIndex(0);
      setShowNext(false);
    }
  };

  const handleConfirm = () => {
    const game = Taro.getStorageSync('game');
    const identifyRound = game.identify;

    if (identifyRound <= round) {
      game.identify = round + 1;
      Taro.setStorageSync('game', game);
    }

    Taro.navigateTo({
      url: '/pages/Round/index?type=2',
    });
  };

  // 判断是否选中正确字词
  const isCorrect = (item, index) => {
    if (item === questions[qid].answer[index]) {
      return true;
    } else {
      return false;
    }
  };

  // 判断是否做完当前题目
  const isConfirm = () => {
    if(confirmList[qid] !== 0 && confirmList[qid] !== 1) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <View className="identify-game-container">
      {show ? (
        <View className="identify-game">
          <Text className="title">第{questions[qid].no}题</Text>
          <Text className="question">{questions[qid].stem}</Text>
          <View className="options">
            {questions[qid].options.map((item, index) => {
              return (
                <View className="option" onClick={() => handleClick(index)}>
                  <View className={'letter'}>{item}</View>
                </View>
              );
            })}
          </View>
          <View className="middle">
            <View className="blanks">
              {questions[qid].answer.map(() => {
                return <View className="blank"></View>;
              })}
            </View>
            <View className="answers">
              {answerList[qid]
                ? answerList[qid].map((item, index) => {
                    return (
                      <View
                        className={
                          'answer' +
                          (isConfirm()
                            ? isCorrect(item, index)
                              ? ''
                              : ' wrong'
                            : '')
                        }>
                        {questions[qid].options[item]}
                      </View>
                    );
                  })
                : null}
            </View>
          </View>
          {confirmList[qid] === 0 ? (
            <View className="hint">
              正确答案为：
              {questions[qid].answer.map((item) => {
                return questions[qid].options[item];
              })}
            </View>
          ) : null}
          <View className="bottom">
            {showNext || isConfirm() ? (
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
        <BeginGame loadBegin={handleBegin} />
      )}
    </View>
  );
}

export default React.memo(IdentifyGame);
