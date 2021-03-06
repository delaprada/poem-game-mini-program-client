import React, { useState } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { getDynasty } from '@utils/index';

import './index.less';

function Record(props) {
  // const { poemInfo: poem } = props;
  // const poemInfo = poem ? poem.toJS() : {};
  // console.log(poemInfo);
  const [firstRecord, setfirstRecord] = useState(true);
  const [pause, setPause] = useState(false);

  const poemInfo = {
    id: 1,
    chapter: '学而第壹',
    content:
      '子曰：“学而时习之，不亦悦乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？”|有子曰：“其为人也孝悌而好犯上者，鲜矣。不好犯上而好作乱者，未之有也。君子务本，本立而道生。孝悌也者，其为仁之本与？”|子曰：“巧言令色，鲜矣仁。”|曾子曰：吾日三省乎吾身。为人谋而不忠乎？与朋友交而不信乎？传不习乎？|子曰：道千乘之国，敬事而信，节用而爱人，使民以时。|子曰：弟子入则孝，出则悌，谨而信，泛爱众而亲仁，行有余力，则以学文。|子夏曰：贤贤易色，事父母，能竭其力。事君，能致其身。与朋友交，言而有信。虽曰未学，吾必谓之学矣。|子曰：君子不重则不威，学则不固。主忠信，无友不如己者，过则勿惮改。|曾子曰：慎终追远，民德归厚矣。|子禽问于子贡曰：“夫子至于是邦也，必闻其政。求之与？抑与之与？”子贡曰：“夫子温良恭俭让以得之。夫子求之也，其诸异乎人之求之与？”|子曰：父在，观其志。父没，观其行。三年无改于父之道，可谓孝矣。|有子曰：礼之用，和为贵。先王之道斯为美。小大由之，有所不行。知和而和，不以礼节之，亦不可行也。|有子曰：信近于义，言可复也。恭近于礼，远耻辱也。因不失其亲，亦可宗也。|子曰：君子食无求饱，居无求安。敏于事而慎于言，就有道而正焉。可谓好学也已。|子贡曰：“贫而无谄，富而无骄。何如？”子曰：“可也。未若贫而乐，富而好礼者也。”子贡曰：“诗云：如切如磋，如琢如磨。其斯之谓与？”子曰：“赐也，始可与言诗已矣。告诸往而知来者。”|子曰：不患人之不己知，患不知人也。',
    category: 2,
  };

  const handleClick = () => {
    if (firstRecord) {
      setfirstRecord(false);
    }
    const curPause = pause;
    setPause(!curPause);
  };

  return (
    <View className="record-container">
      <ScrollView
        className="scroll-view"
        scrollY
        scrollWithAnimation
        scrollTop={0}>
        <View className="title">
          {poemInfo.title ? poemInfo.title : poemInfo.chapter}
        </View>
        {poemInfo.author ? (
          <View className="author">
            <Text className="dynasty">{getDynasty(poemInfo.dynasty)}</Text>
            <Text className="name">{poemInfo.author}</Text>
          </View>
        ) : null}
        <View className="content">
          {poemInfo.content.split('|').map((item) => {
            return <Text>{item}</Text>;
          })}
        </View>
      </ScrollView>
      <View className="bottom">
        <View onClick={handleClick}>
          {firstRecord ? (
            <AtIcon prefixClass="fa" value="microphone" size="30"></AtIcon>
          ) : (
            <View>
              {pause ? (
                <AtIcon value="pause" size="30"></AtIcon>
              ) : (
                <AtIcon value="play" size="30"></AtIcon>
              )}
            </View>
          )}
        </View>
        <View>
          {
            !pause && !firstRecord ? <AtIcon value="check" size="30"></AtIcon> : null
          }
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  poemInfo: state.getIn(['poem', 'poemInfo']),
});

export default connect(mapStateToProps, null)(React.memo(Record));
