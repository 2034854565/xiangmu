


const fanData=[
    {
      id:"fan_1",  //风机编号，手动编号，唯一标识
      name: 'HXD1机车牵引风机 ',
      label: "牵引风机 ",   // 风机分类
      description: "用于HXD1、HXD2、HXD3、韶山系列、南非22E等电力机车牵引电机冷却。",
      img: "/fans/img/1_1.jpg" , //对应文件夹图片路径
      train_type:"电力机车",
      remark:"",
      create_at:"2023-04-04 19:00:00",
      create_by:"12002",
      update_at:"2023-04-04 19:00:00",
      update_by:"12002"
    },
    {
      id:"fan_2",  
      name: 'HXD3机车牵引风机 ',
      label: "牵引风机 ",   
      description: "用于HXD1、HXD2、HXD3、韶山系列、南非22E等电力机车牵引电机冷却。",
      img: "/fans/img/1_2.jpg"  

    },
    {
      id:"fan_3",  
      name: '南非22E机车牵引风机 ',
      label: "牵引风机 ",   
      description: "用于HXD1、HXD2、HXD3、韶山系列、南非22E等电力机车牵引电机冷却。",
      img: "/fans/img/1_3.jpg"  

    },
    {
      id:"fan_4",  
      name: '标准动车组变压器风机 ',
      label: "变压器风机 ",   
      description: "用于 CRH2、CRH5、350km/h 标准化动车组，250km/h 标准化动车组变压器冷却。",
      img: "/fans/img/2_1.jpg"  

    },
    {
      id:"fan_5",  
      name: '动车组变压器风机 ',
      label: "变压器风机 ",   
      description: "用于 CRH2、CRH5、350km/h 标准化动车组，250km/h 标准化动车组变压器冷却。",
      img: "/fans/img/2_2.jpg"  

    },
    {
      id:"fan_6", 
        name: '标动唐客350风机  ',
        label: "变流器风机 ",
        description: "用于 CRH2、CRH5、CRH380A、 CRH380D. 350km/h 标准化动车组，250km/h 标准化动车组牵引电机冷却。",
        img: "/fans/img/3_1.jpg"
    
      },
    {
    id:"fan_7", 
      name: 'CRH2辅变流器风机  ',
      label: "变流器风机 ",
      description: "用于 CRH2、CRH5、CRH380A、 CRH380D. 350km/h 标准化动车组，250km/h 标准化动车组牵引电机冷却。",
      img: "/fans/img/3_2.jpg"
  
    },
    {
      id:"fan_8",
      name: '标准动车主变流器风机 ',
      label: "变流器风机 ",
      description: "用于 CRH2、CRH5、CRH380A、 CRH380D. 350km/h 标准化动车组，250km/h 标准化动车组牵引电机冷却。",
      img: "/fans/img/3_3.jpg"
  
    },
    {
      id:"fan_9",
      name: '动车组水冷系统 ',
      label: "冷却塔风机 ",
      description: "牵引变流器水冷系统是集成水泵、风机、管路、热交换器及冷却介质状态监控等必要设备的冷却系统。具有总重量轻、噪音小、抗震能力强、热力性能好、易维护、成本低等特点。",
      img: "/fans/img/4_1.jpg"
  
    },
    {
      id:"fan_10",
      name: '机车复合冷却塔 ',
      label: "冷却塔风机 ",
      description: "复合冷却塔集变压器油路和逆变器水路的复合散热器、水膨胀箱、辅助油箱、冷却风机、保护装置、布赫继电器和干燥器于一体，具有集成化、模块化、轻量化等特点，采用成熟技术，运行可靠性高等。",
      img: "/fans/img/4_2.jpg"
  
    },
    {
      id:"fan_11",
      name: '动车组水冷系统 ',
      label: "冷却塔风机 ",
      description: "牵引变流器水冷系统是集成水泵、风机、管路、热交换器及冷却介质状态监控等必要设备的冷却系统。具有总重量轻、噪音小、抗震能力强、热力性能好、易维护、成本低等特点。",
      img: "/fans/img/4_3.jpg"
  
    },
    // {
    //   id:"fan_12",
    //   name: '地铁车辆制动电阻 ',
    //   label: "制动电阻 ",
    //   description: "具有消耗过剩的制动电能，为动力系统提供过压保护。具有体积小、容量大、低噪音、可靠性高、出口温度低、易维护等特点。可根据客户设备电阻使用时的温度、热量变化、机械性能、散热功率特定设计、制作专用的产品。",
    //   img: "/fans/img/5_1.jpg"
  
    // },
    // {
    //   id:"fan_13",
    //   name: '轨道工程车制动电阻 ',
    //   label: "制动电阻 ",
    //   description: "具有消耗过剩的制动电能，为动力系统提供过压保护。具有体积小、容量大、低噪音、可靠性高、出口温度低、易维护等特点。可根据客户设备电阻使用时的温度、热量变化、机械性能、散热功率特定设计、制作专用的产品。",
    //   img: "/fans/img/5_2.jpg"
  
    // },
    // {
    //   id:"fan_14",
    //   name: '自卸车制动电阻 ',
    //   label: "制动电阻 ",
    //   description: "具有消耗过剩的制动电能，为动力系统提供过压保护。具有体积小、容量大、低噪音、可靠性高、出口温度低、易维护等特点。可根据客户设备电阻使用时的温度、热量变化、机械性能、散热功率特定设计、制作专用的产品。",
    //   img: "/fans/img/5_3.jpg"
  
    // },
    // {
    //   id:"fan_15",
    //   name: '高压箱 ',
    //   label: "电气产品 ",
    //   description: "本产品专门用于西门子国际地铁项目，主要由隔离开关、高速断路器、辅助二极管、库用插座等器件组成， 将输入的直流电源分配给牵引主电路及辅助电源主电路，实现牵引、辅助电源及库用电源间高压主电路的 切换、隔离与接地，具有牵引及辅助主电路的短路保护功能 。",
    //   img: "/fans/img/6_1.jpg"
  
    // },
    // {
    //   id:"fan_16",
    //   name: '辅变柜 ',
    //   label: "电气产品 ",
    //   description: "主要由两个三相辅动变压器、离心风机、旋风除尘器、柜体、连线端子组成、该变压器由变流器供电，次级给辅助机组提供 440V/60Hz 的电源。所需冷却空气从机车外部进入柜体，通过风机后，经风道和风道隔 板，冷却交压器线圈。空气经旋风除尘器进入到正压的机车机械间，离心风机通过安装板吊挂在柜体顶板上， 其作用保证了变压器足够的冷却并且提供了足量的空气用来冷却机器。旋风除尘器通过螺纹连接安装在前 面板上，其作用在空气进入机械间之前分离空气中的灰尘与水分。",
    //   img: "/fans/img/6_2.jpg"
  
    // },
    // {
    //   id:"fan_17",
    //   name: '辅助变压器柜（含变压器） ',
    //   label: "电气产品 ",
    //   description: "由主变压器供电，次级给机车辅助机组提供400V/60hz的电源。",
    //   img: "/fans/img/6_3.jpg"
  
    // },
    // {
    //   id:"fan_18",
    //   name: '在线监测 ',
    //   label: "智慧产品 ",
    //   description: "用于时速160km/h动力集中型动车，主要对机械间内牵引风机、辅变风机、冷却塔风机的轴承温度、风速、振动速度等关键运行参数进行实时监测，为通风冷却设备状态监测及设备维护提供依据。\n使用环境：温度：-25℃~+55℃，海拔：≤2500m\n电源：DC24V\n整机功耗：＜60W\n通讯接口：以太网接口（监测主机与列控）；\nCAN总线接口（监测主机与信号采集终端）。/60hz的电源。",
    //   img: "/fans/img/7_1.jpg"
  
    // },
    // {
    //   id:"fan_19",
    //   name: '油田风机 ',
    //   label: "其他风机 ",
    //   description: "用于油田钻井电机、控制柜冷却。",
    //   img: "/fans/img/8_1.jpg"
  
    // },
    // {
    //   id:"fan_20",
    //   name: '地铁空调风机 ',
    //   label: "其他风机 ",
    //   description: "用于地铁空调冷却。",
    //   img: "/fans/img/8_2.jpg"
  
    // },
  ];

  export default fanData;