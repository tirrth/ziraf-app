const config = {
  screens: {
    BottomTabRoot: {
      screens: {
        SettingsRoot: {
          screens: {
            MyOrders: 'order/view/:order_id',
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['https://www.zirafapp.com/admin', 'zirafapp://admin'],
  config,
};

export default linking;
