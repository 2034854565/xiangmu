import type { FC } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';
import styles from './style.less';

const Resource: FC = () => {

  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    if (window.location.search.indexOf("?") != -1) {
      const str = window.location.search.substr(1);
      const list = str.split('=');
      const type = list[1];
      const src = type === '1' ? 'https://www.chinametro.net/index.php': 'https://www.cctaw.cn/';
      setIframeSrc(src);
    }
  }, []);

  return (
    <div style={{ margin: -24 }}>
      <div className={styles.container}>
        <iframe style={{ width: '100%', height: 1400 }} src={iframeSrc}></iframe>
      </div>
    </div>
  );
};

export default Resource;
