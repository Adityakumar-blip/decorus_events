import React, {createRef, useState} from 'react';
import {TextInput, View} from 'react-native';

export default function OTPInput({
  inputCount = 6,
  onChange,
  contentContainerStyle,
  inputStyle,
}) {
  const count = inputCount;
  const [focusedInput, setFocusedInput] = useState(0);
  const refs = [...Array(count).map(_ => createRef())];
  const [text, setText] = useState([...Array(count)]);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        },
        contentContainerStyle,
      ]}>
      {[...Array(count)].map((item, index) => (
        <NumberInput
          key={'a' + index}
          inputStyle={inputStyle}
          text={text}
          setText={setText}
          focusedInput={focusedInput}
          setFocusedInput={setFocusedInput}
          item={item}
          refs={refs}
          index={index}
          count={count}
          onSubmit={value => onChange(value)}
        />
      ))}
    </View>
  );
}
const NumberInput = React.memo(
  ({
    count,
    index,
    onSubmit,
    text,
    setText,
    refs,
    setFocusedInput,
    focusedInput,
    inputStyle,
  }) => {
    const onChangeText = t => {
      const tempText = text;
      text[index] = t;
      setText(tempText);
      if (t) {
        if (index < refs.length - 1) {
          refs[index + 1].focus();
        }
      } else if (index === refs.length - 1) {
        if (index > 0) {
          refs[index - 1].focus();
        }
      }
      onSubmit(text.toString().split(',').join(''));
    };
    return (
      <TextInput
        ref={r => (refs[index] = r)}
        maxLength={1}
        selectionColor={'blue'}
        onFocus={() => setFocusedInput(index)}
        value={text[index]}
        keyboardType="phone-pad"
        style={[
          {
            textAlign: 'center',
            borderWidth: 2,
            width: `${100 / count - 2}%`,
            maxWidth: 50,
            height: 50,
            color : "black"
          },
          inputStyle,
        ]}
        onChangeText={onChangeText}
      />
    );
  },
);
