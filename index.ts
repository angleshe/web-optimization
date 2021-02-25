import { common } from '@/script/test';
import '@/style/index.scss';
import tagIcon from 'images/tag.png';
import React from 'react';
import ReactDom from 'react-dom';

// js引入图片
const imageDom = document.createElement<'img'>('img');
imageDom.src = tagIcon;
imageDom.style.display = 'block';
document.body.append(imageDom);

// 添加列表
const addListItemBtn = document.getElementById('add-list-item-event');
const listContainerDom = document.getElementById('list-container');

// 绑定addListItemBtn点击事件
// 在listContainerDom中增加3个li
addListItemBtn?.addEventListener('click', () => {
  const fragment = document.createDocumentFragment();
  for (let i: number = 0; i < 3; i++) {
    const liDom = document.createElement('li');
    liDom.innerText = i.toString();

    // 为何不直接使用listContainerDom?.append ？？？
    // listContainerDom?.append是向dom中添加节点
    // 如果使用listContainerDom?.append循环3次必定产生3次回流
    // 用fragment相当于先把要添加的节点放入内存中
    // 循环结束后再调用listContainerDom?.append，一次性把内存中所有新增的节点添加如dom中
    fragment.appendChild(liDom);
  }

  listContainerDom?.append(fragment);
});

const transformBtn = document.getElementById('transform-event');

const liWidth: number = addListItemBtn?.offsetWidth ?? 100;

transformBtn?.addEventListener('click', () => {
  if (listContainerDom && listContainerDom.childElementCount) {
    // 为什么要display先none后再block ？？？
    // display可以关闭该节点内的回流
    listContainerDom.style.display = 'none';
    for (let i: number = 0; i < listContainerDom.childElementCount; i++) {
      if (listContainerDom.children[i] instanceof HTMLLIElement) {
        // 每次使用addListItemBtn?.offsetWidth会产生回流
        // 所以这里不直接使用listContainerDom.style.width = `${addListItemBtn?.offsetWidth}px`
        // 用变量先把addListItemBtn?.offsetWidth存起来以后使用变量就不会产生回流了
        listContainerDom.style.width = `${liWidth}px`;
        listContainerDom.style.backgroundColor = 'red';
      }
    }
    listContainerDom.style.display = 'block';
  }
});

// 这是js注释
console.log('这是第一个页面', common);

// test React

const reactRootDom = document.getElementById('react-root');

if (reactRootDom) {
  ReactDom.render(React.createElement('span', null, 'hello react!'), reactRootDom);
}
