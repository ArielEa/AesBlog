const getters = {
  logo_l: state => state.app.logo_l,
  logo_s: state => state.app.logo_s,
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  accountList: state => state.user.accountList,
  account_code: state => state.user.account_code,
  notice: state => state.user.notice,
  noticeObj: state => state.user.noticeObj,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  menuObj: state => state.permission.menuObj,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n && state.i18n.lang,
  setDrawer: state => state.app.setDrawer,
  loading: state => state.app.loading,
  sidebar: state => state.app.sidebar,

  // 缓存部分
  CachedManage: state => state.app.CachedManage,
  history: state => state.app.history,
  cached: state => state.app.cached,
  regions: state => state.app.regions,
  currency: state => state.app.currency
}

export default getters
