# Vc Material

Vc Material 是一个前端构建块库，它提供了一系列可重用、可定制化的前端组件，帮助开发者快速构建高质量的网页和应用程序

## Features

Vc Material 目前提供了以下功能：

- 容器
- 搜索条
- 分页条
- 表格(分带分页，不带分页)
- 菜单
- 树
- 控制器
- 富文本编辑器
- 分类管理弹层
- 组合输入框
- ....

这些组件可用于构建丰富、多样的用户界面，提高前端开发效率，让开发者可以更专注于业务逻辑的实现。

## Usage

你可以使用 npm 或 yarn 安装 Vc Material：

```bash
npm install vc-material
```

```bash
yarn add vc-material
```

在项目中引入 Vc Material 的组件：

```javascript
import {
  Container,
  SearchBar,
  Pagination,
  Menu,
  RichTextEditor,
  ComboInput
} from 'vc-material';

function App() {
  return (
    <div>
      <Container>{/* ... */}</Container>
      <SearchBar>{/* ... */}</SearchBar>
      <Pagination>{/* ... */}</Pagination>
      <Menu>{/* ... */}</Menu>
      <RichTextEditor>{/* ... */}</RichTextEditor>
      <ComboInput>{/* ... */}</ComboInput>
    </div>
  );
}
```

每个组件都有自己的属性和用法，具体信息请参考组件的文档。

## Documentation

更多组件的文档和示例请参考 [Vc Material 文档](http://192.168.2.195:3200/vc-material)。

## Contribution

如果您有任何建议或发现了 Bug，请直接改了吧。[Vc Material](http://192.168.2.253/fe-tools/vc-material)
