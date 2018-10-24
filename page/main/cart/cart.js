var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		hasData:false,//购物车是否有商品
    totalPrice:0,//合计价格
    goods_num:1,
		selectAllStatus:true,//全选状态，默认全选
    lists:[
      {
        'imgs':'/images/jj02.jpg',
        'name':'家居客厅电视柜博古架红酒柜办公桌装饰柜招财摆件家居客厅电视柜博古架红酒',
        'price':'56',
        'desc':'灰色，中等',
        'amount': '3',
				'selected':true
      },
      {
        'imgs': '/images/jj02.jpg',
        'name': '家居客厅电视柜博古架红酒柜办公桌装饰柜招财摆件家居客厅电视柜博古架红酒',
        'price': '46',
        'desc': '灰色，中等',
        'amount':'5',
				'selected': true				
      },
      {
        'imgs': '/images/jj02.jpg',
        'name': '家居客厅电视柜博古架红酒柜办公桌装饰柜招财摆件家居客厅电视柜博古架红酒',
        'price': '66',
        'desc': '灰色，中等',
        'amount': '1',
				'selected': true				
      },
			{
				'imgs': '/images/jj02.jpg',
				'name': '家居客厅电视柜博古架红酒柜办公桌装饰柜招财摆件家居客厅电视柜博古架红酒',
				'price': '46',
				'desc': '灰色，中等',
				'amount': '5',
				'selected': true
			},
			{
				'imgs': '/images/jj02.jpg',
				'name': '家居客厅电视柜博古架红酒柜办公桌装饰柜招财摆件家居客厅电视柜博古架红酒',
				'price': '66',
				'desc': '灰色，中等',
				'amount': '1',
				'selected': true
			}
    ]
  },

	//单选商品
	selectList(e){
			var selectedNum = 0;//单个被选中的商品数量
			const index = e.currentTarget.dataset.index;	
			let lists = this.data.lists;
			const selected = lists[index].selected;
			lists[index].selected = !selected;
			this.setData({
				lists:lists
			});
		  //选中后计算总价
			if(!lists.length){
				this.setData({
					hasList:false
				})
			}else{
				this.getTotalPrice();
			}
			//取消单选时改变全选状态
			if(lists[index].selected == false){
				this.setData({
					selectAllStatus:false
				})
				this.getTotalPrice();
			}	
			//选中所有商品，自动勾选全选按钮
			for(var i=0;i<lists.length;i++){
				if(lists[i].selected == true){
					selectedNum++;
					console.log(selectedNum);
					if(selectedNum == lists.length){
							this.setData({
								selectAllStatus:true
							})
					}
				}
			}
			this.getTotalPrice();
	},

	//全选商品
	selectAll(e){
			let selectAllStatus = this.data.selectAllStatus;
			let lists = this.data.lists;
			
			selectAllStatus = !selectAllStatus;

			for(let i=0;i<lists.length;i++){
				lists[i].selected = selectAllStatus;
			}
			this.setData({
				selectAllStatus:selectAllStatus,
				lists:lists
			});
			this.getTotalPrice();
	},

  // 加
  jia_fn:function(e){
    var index = e.target.dataset.k;
    var lists = this.data.lists;
    lists[parseInt(index)].amount++
    this.setData({
      lists:lists
    })
		this.getTotalPrice();
  },
  // 减
  jian_fn:function(e){
    var index = e.target.dataset.k;
    var lists = this.data.lists;
    if (lists[parseInt(index)].amount==1){
      return
    }else{
      lists[parseInt(index)].amount--
      this.setData({
        lists: lists
      })
		 this.getTotalPrice();
    }
  },

	//计算商品总价
	getTotalPrice() {
		let lists = this.data.lists;  
		let total = 0;
		for (let i = 0; i < lists.length; i++) {
			if (lists[i].selected) {
				total += lists[i].amount * lists[i].price;
			}
		}
		this.setData({
			lists: lists,
			totalPrice: total.toFixed(2)	
		});
	},
	//从购物车删除商品
	deleteItem(e){
		var index = e.currentTarget.dataset.index;
		let lists = this.data.lists;
		lists.splice(index,1);
		this.setData({
			lists:lists
		});
		if(!lists.length){
			this.setData({
				hasData:false
			})
		}else{
			this.getTotalPrice();
		}
	},	

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
		var selectedNum = 0;
		let lists = this.data.lists;
		// 判断购物车是否有数据控制显示内容
		if(lists.length){
				this.setData({
					hasData:true
				})
		}else{
				this.setData({
						hasData:false
				})
		}
		this.getTotalPrice();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util_js.shareApp();
  }
})