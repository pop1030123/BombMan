

    let DIR = cc.Enum({
        UP:0,
        RIGHT:1,
        DOWN:2,
        LEFT:3
    });

cc.Class({
    extends: cc.Component,

    properties: {

        bombPrefab:{
            default:null ,
            type:cc.Prefab,
        },

        map:{
            default:null ,
            type:cc.TiledMap,
        },
        hideLayer:{
            default:null,
            type:cc.TiledLayer,
        },
        mainLayer:{
          default:null,
          type:cc.TiledLayer,
        },
        soilLayer:{
            default:null,
            type:cc.TiledLayer,
        },
        player:{
            default:null,
            type:cc.Node,
        },
        enemy:{
            default:null,
            type:cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {
        let self = this ;
        this.loadMap();
        this.map.node.on("exploded" ,function(){
            // 检查炸弹的上下左右是否是soil
            if(self.soilLayer.getTileGIDAt(cc.p(self.bombTile.x ,self.bombTile.y - 1 ))){
                // 炸弹上面是soil，可炸
                self.soilLayer.removeTileAt(cc.p(self.bombTile.x ,self.bombTile.y - 1 )) ;
            }
            if(self.soilLayer.getTileGIDAt(cc.p(self.bombTile.x ,self.bombTile.y + 1))){
                // 炸弹下面是soil，可炸
                self.soilLayer.removeTileAt(cc.p(self.bombTile.x ,self.bombTile.y + 1 )) ;
            }
            if(self.soilLayer.getTileGIDAt(cc.p(self.bombTile.x - 1 ,self.bombTile.y))){
                // 炸弹左面是soil，可炸
                self.soilLayer.removeTileAt(cc.p(self.bombTile.x - 1,self.bombTile.y)) ;
            }
            if(self.soilLayer.getTileGIDAt(cc.p(self.bombTile.x + 1,self.bombTile.y))){
                // 炸弹右面是soil，可炸
                self.soilLayer.removeTileAt(cc.p(self.bombTile.x + 1 ,self.bombTile.y )) ;
            }
            // 把炸弹移除掉
            self.map.node.removeChild(self.bomb) ;
        }) ;
    },

    btnBomb:function(){
        this.bomb = cc.instantiate(this.bombPrefab) ;
        this.bombTile = this.playerTile ;
        this.bomb.setAnchorPoint(0, 0);
        this.map.node.addChild(this.bomb) ;
        let pos = this.mainLayer.getPositionAt(this.bombTile) ;
        this.bomb.setPosition(pos) ;
    },

    btnDown:function(){
        this.playerDir = DIR.DOWN ;
        let playerTarTile = cc.p(this.playerTile.x ,this.playerTile.y + 1) ;
        this.tryMoveToTarTile(playerTarTile) ;
    },
    btnUp:function(){
        this.playerDir = DIR.UP ;
        let playerTarTile = cc.p(this.playerTile.x ,this.playerTile.y - 1) ;
        this.tryMoveToTarTile(playerTarTile) ;
    },
    btnLeft:function(){
        this.playerDir = DIR.LEFT ;
        let playerTarTile = cc.p(this.playerTile.x -1 ,this.playerTile.y) ;
        this.tryMoveToTarTile(playerTarTile) ;
    },
    btnRight:function(){
        this.playerDir = DIR.RIGHT ;
        let playerTarTile = cc.p(this.playerTile.x +1 ,this.playerTile.y) ;
        this.tryMoveToTarTile(playerTarTile) ;
    },

    tryMoveToTarTile:function(newTile){
        // 让玩家别撞到了墙上
        if(this.mainLayer.getTileGIDAt(newTile)){
            cc.log('hit the wall .') ;
            return false ;
        }
        if(this.soilLayer.getTileGIDAt(newTile)){
            cc.log('hit the soil .') ;
            return false ;
        }
        // 检查玩家是否和敌人进行了碰撞
        if(cc.pointEqualToPoint(newTile ,this.enemyTile)){
            cc.log('hit the enemy .') ;
            return false ;
        }

        this.playerTile = newTile ;
        this.updatePlayerPos() ;
    },



    loadMap:function(){
        // 获取对象层
        let objects = this.map.getObjectGroup('objects') ;
        // 获取对象
        let playerObj = objects.getObject('player') ;
        let enemyObj = objects.getObject('enemy') ;
        // 获取坐标
        let playerPos = cc.p(playerObj.offset.x ,playerObj.offset.y) ;
        let enemyPos  = cc.p(enemyObj.offset.x ,enemyObj.offset.y) ;
        // 玩家和敌人的瓦片坐标
        this.playerTile = this.getTilePosition(playerPos) ;
        this.enemyTile  = this.getTilePosition(enemyPos) ;
        // 设置敌人的位置
        let pos2 = this.mainLayer.getPositionAt(this.enemyTile) ;
        this.enemy.setPosition(pos2) ;
        this.enemyDir = DIR.RIGHT ;

        // 更新玩家的位置
        this.updatePlayerPos() ;
        this.playerDir = DIR.DOWN ;

    },

    updatePlayerPos:function(){
        let pos = this.mainLayer.getPositionAt(this.playerTile) ;
        this.player.setPosition(pos) ;
    },
    // 将地图中的坐标转为瓦片的坐标
    getTilePosition:function(posInPixel){
        let mapSize = this.node.getContentSize();
        let tileSize = this.map.getTileSize();
        let x = Math.floor(posInPixel.x / tileSize.width) ;
        let y = Math.floor(posInPixel.y / tileSize.height) ;
        return cc.p(x ,y) ;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // 敌人的逻辑
        if(this.enemyDir == DIR.RIGHT){
            this.enemy.x++ ;
            if(this.enemy.x > 544){
                this.enemyDir = DIR.LEFT ;
            }
        }else{
            this.enemy.x-- ;
            if(this.enemy.x < 32){
                this.enemyDir = DIR.RIGHT ;
            }
        }


    },
});
