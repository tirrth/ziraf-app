const config = {
  screens: {
    OrderDetails: {
      path: 'order/view/:order_id/:highlighted_order_item_uuid?',
    },
    Orders: {
      path: 'orders/:highlighted_order_no?',
    },
  },
};

const linking = {
  prefixes: ['https://www.zirafapp.com/admin', 'zirafapp://admin'],
  config,
};

export default linking;
