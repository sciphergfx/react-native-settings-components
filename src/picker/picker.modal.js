import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import toString from 'lodash/toString';
import PickerModalItem from './picker.modal.item';

const style = StyleSheet.create({
  outerWrapper: {
    backgroundColor: '#33333340',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1
  },
  cancelTouchable: {
    flex: 1,
  },
  innerWrapper: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 0,
    paddingBottom: 40,
    justifyContent: 'flex-end',
    width:'90%',
    alignSelf: 'center',
    shadowRadius: 12,
    shadowColor: '#cccccc',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.7,
  },
  headerWrapper: {
    backgroundColor: 'red',
    position: 'relative',
    flex: 0,
    flexDirection: 'row',
  },
  headerTitleWrapper: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { color: 'white', fontWeight: '600', fontSize: 18 },
  headerDescription: {
    fontSize: 13,
    color: 'white',
  },
  headerCloseBtnWrapper: {
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  headerCloseBtnText: {
    color: 'white',
    fontSize: 16,
  },
  listWrapper: {
    height: 300,
  },
  listScrollView: { backgroundColor: 'white' },
});

class PickerModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    pickerOpen: PropTypes.bool.isRequired,
    pickerValue: PropTypes.array.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    dialogDescription: PropTypes.string,
    modalStyle: PropTypes.shape({
      innerWrapper: PropTypes.object,
      header: PropTypes.shape({
        titleWrapper: PropTypes.object,
        title: PropTypes.object,
        description: PropTypes.object,
        closeBtnWrapper: PropTypes.object,
      }),
      list: PropTypes.shape({
        wrapper: PropTypes.object,
        scrollView: PropTypes.object,
        innerWrapper: PropTypes.object,
      }),
    }),
    renderCloseBtn: PropTypes.func,
    renderListItem: PropTypes.func,
  };

  static defaultProps = {
    dialogDescription: null,
    modalStyle: {},
    renderCloseBtn: () => (
      <Text style={style.headerCloseBtnText}>
        {'CLOSE'}
      </Text>
    ),
    renderListItem: null,
  };

  state = {
    scrollViewContentHeight: null,
  };

  onSelectPickerItem = value => () => {
    const { onSelectItem, closeModal, autoSelect, multi } = this.props;
    onSelectItem(value);
    if(!multi && autoSelect) {
       closeModal()
    }
  };

  calculateScrollViewContentHeight = (e) => {
    const { height } = e.nativeEvent.layout;
    this.setState({
      scrollViewContentHeight: height,
    });
  };

  renderPickerItem = ({ item, index }) => {
    const { pickerValue, options, renderListItem } = this.props;
    return isFunction(renderListItem) ? renderListItem({
      item,
      index,
      onSelect: this.onSelectPickerItem(item.value),
      selected: pickerValue.indexOf(item.value) !== -1,
      isFirst: index === 0,
      isLast: index === options.length - 1,
    }) : (
      <PickerModalItem
        key={`picker-item:${toString(index)}`}
        onSelect={this.onSelectPickerItem(item.value)}
        selected={pickerValue.indexOf(item.value) !== -1}
        label={item.label}
        value={item.value}
        isLast={index === options.length - 1}
      />
    );
  };

  render() {
    const {
      closeModal, pickerOpen, dialogDescription, title, modalStyle,
      options, renderCloseBtn, autoSelect,
    } = this.props;
    const { scrollViewContentHeight } = this.state;
    return (
      <Modal
        visible={pickerOpen}
        animationType="fade"
        onRequestClose={closeModal}
        transparent
      >
        <View style={[style.outerWrapper]}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={style.cancelTouchable}  />
          </TouchableWithoutFeedback>
          <View style={[style.innerWrapper, get(modalStyle, 'innerWrapper')]}>
            <View style={[style.headerWrapper, get(modalStyle, 'header.wrapper')]}>
              <View style={[style.headerTitleWrapper, get(modalStyle, 'header.titleWrapper')]}>
                <Text style={[style.headerTitle, get(modalStyle, 'header.title')]}>
                  {title}
                </Text>
                {dialogDescription ? (
                  <Text style={[style.headerDescription, get(modalStyle, 'header.description')]}>
                    {dialogDescription}
                  </Text>) : null}
              </View>
            </View>
            <View style={[style.listWrapper, get(modalStyle, 'list.wrapper')]}>
              <ScrollView style={[style.listScrollView, get(modalStyle, 'list.scrollView')]}>
                <View
                  onLayout={this.calculateScrollViewContentHeight}
                  style={[get(modalStyle, 'list.innerWrapper'), { height: scrollViewContentHeight }]}
                >
                  {map(options, (item, index) => this.renderPickerItem({ item, index }))}
                </View>
              </ScrollView>
            </View>
              <View style={[style.headerCloseBtnWrapper, get(modalStyle, 'header.closeBtnWrapper')]}>
              {!autoSelect && <TouchableOpacity  onPress={closeModal} activeOpacity={0.6}>
                {renderCloseBtn()}
              </TouchableOpacity>}
              </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default PickerModal;
