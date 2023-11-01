import React, { FC, useEffect, useState } from 'react';
import { Stage, Layer, Line, Image, Circle, Text } from 'react-konva';
import useImage from 'use-image';
import { Button, Select, message, Modal } from 'antd';
import FanInfo from '../fanInfo';
// import fanData from "../fanInfo/data"
import { RollbackOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { fanCoolObjectList, fanIntroductionList } from '@/pages/system/FanIntroduction/service';
import App from './components/CreateForm';

interface ViewProps {
  id: any;
  name: any;
  label: any;
  img: any;
  train_type: any;
}

// 适应屏幕大小
var W = innerWidth - 300;
var H = 900;

const View: React.FC<{}> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainType, setTrainType] = useState('0');
  const [fanType, setFanType] = useState(null);
  const [fanIntroduction, setFanIntroduction] = useState(null);
  const [fanData, setFanData] = useState<ViewProps[]>([]);
  const [fanTypeArr, setFanTypeArr] = useState<any[]>([]);
  const onClick = async (item: any) => {
    setFanType(item.label);
    const res = await fanCoolObjectList();
    console.log('item');
    console.log(item);
    console.log('item.coolObject');
    console.log(item.coolObject);
    const resData = res.data.filter((v) => item.coolObject === v.code);
    console.log('resData');
    console.log(resData);

    item.coolObject = resData[0]['name'];
    setFanIntroduction(item);
    setIsModalOpen(true);

    // history.push('/fan');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 选择车型

  // 以通风机为例进行产品介绍

  useEffect(() => {
    fanIntroductionList().then((res) => {
      let fanTypeArr: any[] = [];
      // const arr=res.data;

      // 根据车型过滤数据
      const resData = res.data.filter((item) => item.train_type == trainType);
      setFanData(resData);
      console.log('#####resData#', resData);

      // //取每一种类别的第一组数据
      // if (res.data.length > 0) {
      //   const map = new Map();
      //   console.log('resData');
      //   console.log(resData);
      //   const arr = resData?.filter((v) => !map.has(v.label) && map.set(v.label, 1));
      //   console.log('arr');
      //   console.log(arr);
      //     fanTypeArr = arr?.map((item, index) =>
      //     // console.log("#########",item.img)
      //     ({
      //       id: index,
      //       name: item?.name,
      //       label: item?.label,
      //       train_type: item.train_type,
      //       label_decription: item.label_decription,
      //       sheet: item.sheet,
      //       // img: useImage(item?.img)[0]
      //       img: item.img,
      //     }),
      //   );
      // }

      // //取show不为空的数据
      const arr = resData?.filter((v) => v.show);
      console.log('######', fanTypeArr);
      fanTypeArr = arr?.map((item, index) =>
        // console.log("#########",item.img)
        ({
          id: Number(item.show),
          name: item?.name,
          label: item?.label,
          coolObject: item?.coolObject,
          train_type: item.train_type,
          label_decription: item.label_decription,
          sheet: item.sheet,
          // img: useImage(item?.img)[0]
          img: item.img,
        }),
      );
      setFanTypeArr(fanTypeArr);
    });
  }, [trainType]);

  const onChangeType = (value) => {
    setTrainType(value);
  };
  // 根据label去除重复元素

  // let fanTypeArr: any[]=[];
  // if (fanData.length>0){
  //   const map = new Map();
  //   const arr = fanData?.filter(v => !map.has(v.label) && map.set(v.label, 1));
  //   fanTypeArr = arr?.map((item, index) => ({
  //     id: index,
  //     name: item?.name,
  //     label: item?.label,
  //     img: useImage(item?.img)[0]
  //   }))
  // }

  const [train_1] = useImage('/fans/train_1.png');
  const [train_2] = useImage('/fans/train_2.png');
  const [train_3] = useImage('/fans/train_3.png');

  // 车型产品分布图
  // 位置数组 trainType: '0' 区分车型,
  // 位置数组id按从左到右增，与数据的show字段对应
  // ---------
  // 电力机车
  // 0    1
  // 2
  // ---------
  // ---------
  // 动车
  // 0    1
  // 2
  // ---------
  const dataTypePosition = [
    {
      id: 0,
      trainType: '0',
      imagePositon: [50, 45],
      circle: [130, 110],
      Line_points: [130, 200, 130, 300, 410, 300],
      text: [150, 210],
      circle_node: [410, 300],
    },

    {
      id: 1,
      trainType: '0',
      imagePositon: [420, 47],
      circle: [500, 110],
      Line_points: [500, 200, 500, 270, 500, 270],
      text: [510, 210],
      circle_node: [500, 270],
    },

    // { id: 2, trainType:"0",imagePositon: [774, 50], circle: [850, 110], Line_points: [850, 200, 850, 340, 680, 340], text: [870, 210], circle_node: [680, 340] },
    {
      id: 2,
      trainType: '0',
      imagePositon: [50, 470],
      circle: [130, 530],
      Line_points: [130, 440, 130, 350, 500, 350],
      text: [150, 420],
      circle_node: [500, 350],
    },
    {
      id: 0,
      trainType: '1',
      imagePositon: [335, 35],
      circle: [410, 100],
      Line_points: [410, 190, 410, 300],
      text: [420, 200],
      circle_node: [410, 310],
    },
    {
      id: 1,
      trainType: '1',
      imagePositon: [617, 37],
      circle: [700, 100],
      Line_points: [700, 190, 700, 380, 600, 380],
      text: [710, 200],
      circle_node: [600, 380],
    },
    {
      id: 2,
      trainType: '1',
      imagePositon: [370, 510],
      circle: [450, 570],
      Line_points: [450, 480, 450, 360],
      text: [460, 460],
      circle_node: [450, 360],
    },

    // { id: 7, imagePositon: [620, 30], circle: [700, 110], Line_points: [700, 200, 700, 480, 800, 480], text: [720, 200], circle_node: [800, 480] },
  ];
  console.log('产品分类坐标定位与数据库分类首项一一对应');

  console.log('fanTypeArr');
  console.log(fanTypeArr);

  // 产品分类坐标定位与数据库分类首项一一对应
  const fanTypeData = fanTypeArr?.map((item1) => {
    const dataTypePositionTem = dataTypePosition.filter((item) => item.trainType == trainType);
    let matched = dataTypePositionTem.find((item2) => item2.id === item1.id);
    if (matched != undefined) {
      let merged = Object.assign(item1, matched);
      return merged;
    } else {
      return item1;
    }
  });
  console.log('!!!', fanTypeData, fanTypeData.length);

  const ProductDistribute: React.FC<{ productTypes: any[]; train: any }> = ({
    productTypes,
    train,
  }) => (
    <div>
      <Stage width={W} height={H}>
        <Layer style={{ backgroundColor: '#f1f1f1' }}>
          <Image width={800} height={300} image={train} x={200} y={200} />

          {productTypes.length > 0
            ? productTypes.map((item) => (
                <Image
                  width={160}
                  height={120}
                  image={useImage(item?.img)[0]}
                  x={item.imagePositon[0]}
                  y={item.imagePositon[1]}
                />
              ))
            : null}

          {productTypes.map((item) => (
            <Circle
              radius={90}
              fill="rgb(0,0,0,0)"
              stroke="#188fff7e"
              strokeWidth={2}
              x={item.circle[0]}
              y={item.circle[1]}
              onMouseEnter={(e) => {
                // style stage container:
                const container = e.target.getStage().container();
                container.style.cursor = 'pointer';
              }}
              onClick={() => onClick(item)}
            />
          ))}
          {productTypes.map((item) => (
            <Line points={item.Line_points} strokeWidth={2} stroke="#1890ff" dash={[3, 3]} />
          ))}
          {productTypes.map((item) => (
            <Text
              x={item.text[0]}
              y={item.text[1]}
              text={item.label}
              fill="#000"
              width={200}
              fontSize={14}
            />
          ))}
          {productTypes.map((item) => (
            <Circle
              radius={5}
              fill="#1890ff"
              // stroke="blue"
              strokeWidth={2}
              x={item.circle_node[0]}
              y={item.circle_node[1]}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );

  return (
    <>
      {isModalOpen ? (
        <div>
          <Button
            onClick={handleCancel}
            style={{ zIndex: 999, position: 'absolute', right: '2%', top: '3%' }}
          >
            <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
          </Button>
          <FanInfo fanIntroduction={fanIntroduction} fanType={fanType} fanData={fanData} />
        </div>
      ) : (
        <div>
          请选择车型：{' '}
          <Select
            showSearch
            style={{ width: '15%' }}
            placeholder="选择车型"
            defaultValue={'0'}
            optionFilterProp="children"
            onChange={onChangeType}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: '0',
                label: '机车',
              },
              {
                value: '1',
                label: '动车',
              },
              // {
              //   value: '3',
              //   label: '城轨',
              // },
            ]}
          />
          <App />
          <div
            style={{
              background: '#fff',
              width: W,
              height: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
              paddingLeft: 15,
            }}
          >
            {/* <LoginMessage
                 content={intl.formatMessage({
                   id: 'pages.login.accountLogin.errorMessage',
                   defaultMessage: '账户或密码错误',
                 })}
               /> */}
            {fanTypeData.length > 0 ? (
              <ProductDistribute
                productTypes={fanTypeData}
                train={trainType == '0' ? train_1 : trainType == '1' ? train_2 : train_3}
              />
            ) : null}
          </div>
        </div>
      )}

      {/* </Card> */}
    </>
  );
};

export default View;
