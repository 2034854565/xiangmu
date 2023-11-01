/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-05-04 16:13:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-06 14:53:38
 */
import React, { FC, useRef } from 'react';
import { Carousel } from 'antd';
import styles from './style.less';
import { Image } from 'antd';
import { fallbackImage } from '@/pages/fan/data.d';
import { LeftOutlined, RightCircleFilled, RightOutlined } from '@ant-design/icons';

const CarouselDetail: FC<{ imgList: string[] }> = ({ imgList }) => {
  const myRef = useRef(null);
  return (
    <>
      {imgList.length == 1 ? (
        <Image
          width={300}
          // height={300}
          // src={'/api/download/psad/fan/391702/391702-img3d-1.png'}
          // src={item}+ '?v=' + moment()+ '?v=' + moment()
          src={imgList[0].downloadUrl}
          fallback={fallbackImage}
        />
      ) : (
        <div className={styles.wrap}>
          <div
            className={styles.btnLeft}
            onClick={() => {
              myRef?.current?.prev?.();
            }}
          >
            {/* &lt; */}
            <LeftOutlined />
          </div>
          <div
            className={styles.btnRight}
            onClick={() => {
              myRef?.current?.next?.();
            }}
          >
            {/* &gt; */}
            <RightOutlined />
          </div>
          <Carousel effect="fade" ref={myRef} dots={false} style={{ width: 300 }}>
            {imgList?.map((item) => {
              return (
                <div key={item}>
                  <Image
                    width={300}
                    // height={300}
                    // src={'/api/download/psad/fan/391702/391702-img3d-1.png'}
                    // src={item}+ '?v=' + moment()+ '?v=' + moment()
                    src={item.downloadUrl}
                    fallback={fallbackImage}
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
    </>
  );
};

export default CarouselDetail;
