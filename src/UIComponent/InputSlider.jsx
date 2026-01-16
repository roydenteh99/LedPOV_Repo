import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { useRadioGroup } from '@mui/material';


const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider({value, setValue, rangeWithStep, name="Unnamed", id}) {
  // const [value, setValue] = React.useState(30);

//-------------------------Custom variable---------------------//
  const internalId = React.useId();// 1. Generate a "backup" ID if one wasn't passed as a prop
  const finalId = id || internalId;// 2. Use the provided 'id' if it exists, otherwise use the generated one
  
  const [min, max, step] = rangeWithStep; //establish range
//-------------------------Custom variable---------------------//
  
const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid>
          {/* input iconn here*/}

        </Grid>
        <Grid size="grow">
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
