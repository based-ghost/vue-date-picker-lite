# vue-date-picker-lite

[![Version](https://img.shields.io/npm/v/vue-date-picker-lite.svg)](https://www.npmjs.com/package/vue-date-picker-lite)

A lightweight and easy to use Vue.js datepicker component (created for Vue 2.x)

TODO: replace animated gif with live demo, document use case examples, properties, events, etc..

- [Demo](#demo)
- [Install](#install)

## Demo


![](https://j.gifs.com/vlq8k0.gif)


## Install

``` bash
npm install vue-date-picker-lite --save
```

Use in component..

``` javascript
import DatePickerLite from 'vue-date-picker-lite';

export default {
  // ...
  components: {
    DatePickerLite
  }
  // ...
}
```

``` html
<template>
	<date-picker-lite />
</template>
```

Import styles using SASS..

``` javascript
import 'vue-date-picker-lite/src/styles/style.scss';
```

OR using standard CSS..

``` javascript
import 'vue-date-picker-lite/dist/datePickerLiteStye.css';
```
