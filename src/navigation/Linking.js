const config = {
  screens: {
    BottomTabRoot: {
      screens: {
        SettingsRoot: {
          screens: {
            MyOrders: {
              path: 'order/view/:order_id',
              parse: {
                order_id: String,
              },
            },
          },
        },
      },
    },
  },
};

const linking = {
  // prefixes: ['https://www.zirafapp.com/admin', 'zirafapp://admin'],
  prefixes: ['zirafapp://'],
  config,
};

export default linking;
