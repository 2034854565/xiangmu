import { queryLineCodeTrainCode } from '@/services/lineCodeTrainCode';
import { useEffect, useState } from 'react';
import { currentUser as queryCurrentUser } from '../services/ant-design-pro/api';

export default () => {
  const [initialTrainCode, setInitialTrainCode] = useState("18041042");
  const [initialLineCode, setInitialLineCode] = useState("GZML18");
  const [allLineCode, setAllLineCode] = useState([]);
  const [allTrainCode, setAllTrainCode] = useState([]);
  // // 请求后端数据线路号和列车号
  // const [data,setData]=useState([])
  // const currentUser = await fetchUserInfo();
  const currentUser = {
    name: '超级管理员',
    // access: getAccess(),
  };
  //   useEffect(async () => {
  //     const response = await queryCurrentUser();
  //     response.then((data) => {
  //      
  //       setAllLineCode([data.result[0]?.value, data.result[1]?.value]);
  //       setAllTrainCode([data.result[0]?.children, data.result[1]?.children]);
  //     })
  //   }, []);
  return currentUser;
};
// const { initialTrainCode, initialLineCode } = useModel("initialLineCodeTrainCode")    调用方法