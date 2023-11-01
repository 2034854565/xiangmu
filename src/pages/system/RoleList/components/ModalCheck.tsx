/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-07 16:18:28
 */
import { Button, Avatar, Select, Modal, Form, Input, Card, Table, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';

const ModalCheck: React.FC<{
  allRoutes: { key: number; slotTitle: string; children: [] }[];
  num: number;
  newRouteIds: number[];
  handleNewRoutes: Function;
  currentRoleRoutes?: any;
}> = (props) => {
  const { allRoutes = [], num, newRouteIds, handleNewRoutes } = props;
  const [newRouteIdsSon, setNewRouteIdsSon] = useState<number[]>(props.newRouteIds);
  console.log('allRoutes');
  console.log(allRoutes);
  console.log('props.newRouteIds');
  console.log(props.newRouteIds);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    refresh && setTimeout(() => setRefresh(false));
  }, [refresh]);

  const onChange = (e, item) => {
    console.log('onChange');

    let checkrouteid = e.target.value;
    let ischecked = e.target.checked;
    if (!!item.children) {
      if (ischecked) {
        if (!newRouteIds.includes(item.key)) {
          newRouteIds.push(item.key);
        }
        item.children.map((info) => {
          if (!newRouteIds.includes(info.key)) {
            newRouteIds.push(info.key);
          }
        });
        handleNewRoutes(newRouteIds);
        console.log('1111');

        setNewRouteIdsSon(newRouteIds);
        setRefresh(true);
      } else {
        let index = newRouteIds.indexOf(item.key);
        if (index != -1) {
          newRouteIds.splice(index, 1);
        }
        item.children.map((info) => {
          let index = newRouteIds.indexOf(info.key);
          if (index != -1) {
            newRouteIds.splice(index, 1);
          }
        });
        handleNewRoutes(newRouteIds);
        console.log('2222');

        setNewRouteIdsSon(newRouteIds);
        setRefresh(true);
      }
    } else {
      if (!newRouteIds.includes(checkrouteid) && ischecked) {
        if (!newRouteIds.includes(checkrouteid)) {
          newRouteIds.push(checkrouteid);
        }
        handleNewRoutes(newRouteIds);
        console.log('3333');

        setNewRouteIdsSon(newRouteIds);
        setRefresh(true);
      } else if (newRouteIds.includes(checkrouteid) && !ischecked) {
        let index = newRouteIds.indexOf(checkrouteid);
        if (index != -1) {
          newRouteIds.splice(index, 1);
        }
        handleNewRoutes(newRouteIds);
        console.log('4444');

        setNewRouteIdsSon(newRouteIds);
        setRefresh(true);
      }
    }
  };
  return (
    <div style={{ marginLeft: num }}>
      {/* {newRouteIdsSon} */}
      {/*{newRouteIds} */}
      {newRouteIdsSon &&
        allRoutes.map((item, index) => {
          // console.log(item);
          // console.log(newRouteIdsSon.includes(item.key));

          return (
            <div>
              <Checkbox
                onChange={(e) => onChange(e, item)}
                value={item.key}
                checked={newRouteIdsSon.includes(item.key)}
              >
                {item.slotTitle}
              </Checkbox>
              {!!item.children ? (
                <ModalCheck
                  allRoutes={item.children}
                  num={10}
                  newRouteIds={newRouteIdsSon}
                  handleNewRoutes={handleNewRoutes}
                />
              ) : null}
            </div>
          );
        })}
    </div>
  );
};

export default ModalCheck;
