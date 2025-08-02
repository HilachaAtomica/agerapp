import {Platform} from 'react-native';

export const convertToFormData = (asset: any) => {
  console.log('assets', JSON.stringify(asset));
  let uri = asset?.uri;
  let includes = uri?.includes('file:///');

  if (Platform.OS === 'ios' && !includes) {
    uri = `file:///${uri}`;
  }
  const mime = asset?.type;
  const name =
    asset?.fileName && !asset.fileName.startsWith('rn_image_picker_lib_temp_')
      ? asset.fileName
      : Date.now() + '.' + mime?.split('/')[1];

  return {
    uri,
    type: mime,
    name: name,
  };
};
