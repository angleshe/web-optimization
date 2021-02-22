import { common } from '@/script/test';
import '@/style/index.scss'
import tagIcon from 'images/tag.png';

// js引入图片
const imageDom = document.createElement<'img'>('img');
imageDom.src = tagIcon;
document.body.append(imageDom);

// 这是js注释
console.log('这是第一个页面', common);