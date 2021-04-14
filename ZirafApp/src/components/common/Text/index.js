import React, { Component } from 'react';
import { Text as DefaultText, StyleSheet, Platform } from 'react-native';

export default class Text extends Component {
	render() {
		const { fontVisby, fontSimplicity } = this.props;
		let style = {};
		if (this.props.style) {
			style = JSON.parse(JSON.stringify(this.props.style));
		}

		let fontFamily = 'Lato';
		if (Platform.OS === 'android') {
			fontFamily = 'Lato-Regular';
		}
		if (fontVisby) {
			fontFamily = 'Visby Round CF';
			if (Platform.OS === 'android') {
				fontFamily = 'Visby Round CF Regular';
			}
		}

		if(fontSimplicity) {
			fontFamily = 'simplicity';
		}

		if (style && style.length) {
			let isBold = false;
			let isMedium = false;
			style.map(item => {
				Object.keys(item).map(key => {
					if (
						key &&
						key === 'fontWeight' &&
						item.fontWeight === 'bold'
					) {
						isBold = true;
						if (Platform.OS === 'android') {
							delete item[key];
							fontFamily = 'Lato-Bold';
						}
						if (fontVisby) {
							if (Platform.OS === 'android') {
								fontFamily = 'Visby Round CF Bold';
							}
						}

						if(fontSimplicity) {
							fontFamily = 'simplicity';
						}
						item['fontFamily'] = fontFamily;
					} else if (
						key === 'fontWeight' &&
						item.fontWeight &&
						item.fontWeight === '600'
					) {
						isMedium = true;
						if (Platform.OS === 'android') {
							delete item[key];
							fontFamily = 'Lato-Medium';
						}
						if (fontVisby) {
							if (Platform.OS === 'android') {
								fontFamily = 'Visby Round CF Medium';
							}
						}

						if(fontSimplicity) {
							fontFamily = 'simplicity';
						}
						item['fontFamily'] = fontFamily;
					}
				});
			});

			if (!isBold && !isMedium) {
				style[style.length - 1]['fontFamily'] = fontFamily;
			}
		} else if (style && style.fontWeight && style.fontWeight === 'bold') {
			if (Platform.OS === 'android') {
				delete style['fontWeight'];
				fontFamily = 'Lato-Bold';
			}
			if (fontVisby) {
				if (Platform.OS === 'android') {
					fontFamily = 'Visby Round CF Bold';
				}
			}

			if(fontSimplicity) {
				fontFamily = 'simplicity';
			}
			style['fontFamily'] = fontFamily;
		} else if (style && style.fontWeight && style.fontWeight === '600') {
			if (Platform.OS === 'android') {
				delete style['fontWeight'];
				fontFamily = 'Lato-Medium';
			}
			if (fontVisby) {
				if (Platform.OS === 'android') {
					fontFamily = 'Visby Round CF Medium';
				}
			}
			if(fontSimplicity) {
				fontFamily = 'simplicity';
			}
			
			style['fontFamily'] = fontFamily;
		} else {
			style['fontFamily'] = fontFamily;
		}
		return (
			<DefaultText {...this.props} style={[styles.text, style]}>
				{this.props.children}
			</DefaultText>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		includeFontPadding: true,
		textAlignVertical: 'center',
		color: '#fff'
	}
});
