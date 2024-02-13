import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import styled from '@emotion/styled';

import Battery0 from '../../../assets/img/Battery0.svg';
import Battery1 from '../../../assets/img/Battery1.svg';
import Battery2 from '../../../assets/img/Battery2.svg';
import Battery3 from '../../../assets/img/Battery3.svg';

const BatteryWrapper = styled(Box)`
  display: flex;
  margin-right: 20px;
  align-items: center;
`;

const Battery = ({ value }) => {
  const [fillnum, setFillnum] = useState(1);
  const BatteryArr = [Battery0.src, Battery1.src, Battery2.src, Battery3.src];
  useEffect(() => {
    setFillnum(Math.floor(value / 34) + 1);
    if (value <= 10) {
      setFillnum(0);
    }
  }, [value]);

  return (
    <BatteryWrapper>
      <img src={BatteryArr[fillnum]} width={26.3} height={19} alt="배터리" />
    </BatteryWrapper>
  );
};

Battery.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Battery;
