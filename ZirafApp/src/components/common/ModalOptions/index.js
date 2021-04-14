import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	FlatList
} from 'react-native';
import Text from './../Text';
import cs from '../../../styles/common-styles';

class ModalOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title ? props.title : 'Select Option',
			data: props.data ? props.data : [],
			selected: props.selected ? props.selected : [],
			labelField: props.labelField ? props.labelField : '',
			valueField: props.valueField ? props.valueField : '',
			multiple: props.multiple ? props.multiple : false,
			values: [],
			labels: []
		};
	}

	componentDidMount() {
		const { data, selected, labelField, valueField } = this.state;

		const valuesUpdated = [];
		const labelsUpdated = [];

		if (Array.isArray(selected)) {
			data.filter(d => selected.indexOf(d.id) > -1).forEach(d => {
				valuesUpdated.push(d[valueField]);
				labelsUpdated.push(d[labelField]);
			});
		} else {
			data.filter(d => selected === d.id).forEach(d => {
				valuesUpdated.push(d[valueField]);
				labelsUpdated.push(d[labelField]);
			});
		}

		this.setState({
			values: valuesUpdated,
			labels: labelsUpdated
		});
	}

	componentDidUpdate(prevProps) {
		if (this.props.title !== prevProps.title) {
			this.setState({ title: this.props.title });
		}

		if (this.props.data !== prevProps.data) {
			this.setState({ data: this.props.data });
		}

		if (this.props.selected !== prevProps.selected) {
			this.setState({
				selected: this.props.selected
			});
		}

		if (this.props.labelField !== prevProps.labelField) {
			this.setState({ labelField: this.props.labelField });
		}

		if (this.props.valueField !== prevProps.valueField) {
			this.setState({ valueField: this.props.valueField });
		}

		if (this.props.multiple !== prevProps.multiple) {
			this.setState({ multiple: this.props.multiple });
		}
	}

	onPress(value, label) {
		const { setValue } = this.props;
		const { multiple, selected, valueField, labelField, data } = this.state;
		if (multiple) {
			let selectedUpdate = selected;
			if (Array.isArray(selected)) {
				if (selected.indexOf(value) > -1) {
					selectedUpdate = selected.filter(
						select => select !== value
					);
				} else {
					selectedUpdate.push(value);
				}
			} else {
				selectedUpdate = [value];
			}

			const valuesUpdated = [];
			const labelsUpdated = [];

			data.filter(d => selectedUpdate.indexOf(d.id) > -1).forEach(d => {
				valuesUpdated.push(d[valueField]);
				labelsUpdated.push(d[labelField]);
			});

			this.setState({
				selected: selectedUpdate,
				values: valuesUpdated,
				labels: labelsUpdated
			});
		} else {
			setValue([value], [label]);
		}
	}

	onDone() {
		const { setValue } = this.props;
		const { values, labels } = this.state;
		//console.log(values, labels);
		setValue(values, labels);
	}

	renderItem({ item, index }) {
		const { labelField, valueField } = this.state;
		return (
			<TouchableOpacity
				style={[
					styles.item,
					{ backgroundColor: item.isSelected ? '#F2910A' : '#FFF' }
				]}
				onPress={this.onPress.bind(
					this,
					item[valueField],
					item[labelField]
				)}>
				<Text
					style={[
						styles.itemText,
						{ color: item.isSelected ? '#FFF' : '#333' }
					]}>
					{item[labelField]}
				</Text>
			</TouchableOpacity>
		);
	}

	render() {
		const { title, data, selected, multiple } = this.state;

		return (
			<View style={[styles.container]}>
				{multiple && (
					<View style={[styles.doneButton]}>
						<TouchableOpacity
							style={{ flex: 1, padding: 20 }}
							onPress={this.onDone.bind(this)}>
							<Text
								fontVisby={true}
								style={[
									{ color: '#FFF', textAlign: 'center' },
									cs.font18
								]}>
								Done
							</Text>
						</TouchableOpacity>
					</View>
				)}
				{title && (
					<Text
						fontVisby={true}
						style={[
							{
								color: '#F2910A',
								textAlign: 'center',
								marginTop: 30,
								marginBottom: 20
							},
							cs.font18
						]}>
						{title}
					</Text>
				)}
				<FlatList
					style={[{ marginBottom: 70 }]}
					windowSize={11}
					data={data.map(option => {
						return {
							...option,
							isSelected: Array.isArray(selected)
								? selected.indexOf(option.id) > -1
								: selected === option.id
						};
					})}
					renderItem={this.renderItem.bind(this)}
					keyExtractor={zirafer => zirafer.id}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		flex: 1
	},
	item: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#F2910A'
	},
	itemText: {
		color: '#737373'
	},
	doneButton: {
		position: 'absolute',
		backgroundColor: '#F2910A',
		bottom: 0,
		width: '100%',
		zIndex: 200
	}
});

export default ModalOptions;
