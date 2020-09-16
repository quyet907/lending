import React, { Component } from "react";
import { View, FlatList } from "react-native";
import ProductBid from "../components/bid/ProductBid";
import myStyle from "../style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux"
import { BidService } from "../services/BidService";
import { BidProduct } from "@StockAfiCore/model/bid/BidProduct";
import { FormatService } from "../services/FormatService";
import { ScreenName } from "./ScreenName";
import {firebase} from "../../FirebaseConfig";
import { useIsFocused } from "@react-navigation/native";


var autoReload: any;
class ListBidding extends Component<Props, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      biddings: [],
      reload: true
    };

    this.getListBidding();
  }


  }

  componentWillUnmount() {
    // console.log("on wil unmount on list bidding");
    clearInterval(autoReload);
    this.setState({ biddings: [] })
  }

  componentDidMount() {
    // this.getListBidding()
    autoReload = setInterval(
      () => {
        this.setState({
          reload: !this.state.reload
        })

      },
      500
    );
  }
  componentWillReceiveProps(nextProps : any ){
    if(nextProps.isFocused){
      this.getListBidding();
    }
  }

  getListBidding() {
    BidService.getListBidding().then((bidProducts: BidProduct[]) => {
      this.setState({
        biddings: bidProducts
      })
 
    })
  }


  render() {
    return (
      <View style={myStyle.containerLight}>
        <FlatList
          data={this.state.biddings}
          extraData={this.state.reload}
          contentContainerStyle={myStyle.ListBidProduct}
          renderItem={({ item }) => {
            if (BidService.getTimeCountBid(item) >= 0) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate(ScreenName.BidProduct, {
                      bidProductId: item._id
                    });


                  }}
                >
                  <ProductBid
                    bidProduct={item}
                    reload={this.state.reload}
                  />
                </TouchableOpacity  >
              )
            } 
              return (<div></div>)
            

          }



          }
          keyExtractor={(item) => (item._id != undefined ? item._id : "null")}
        />
      </View>
    );
  }
}

type Props = {
  navigation: any, 
  isFocused: boolean,
};
type state = {
  biddings: Array<BidProduct>;
  reload: boolean
};


export default function (props : Props){
  console.log(useIsFocused())
  return <ListBidding {...props} isFocused = {useIsFocused()} />
}