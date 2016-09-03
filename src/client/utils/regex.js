import generateUrlRegex from 'url-regex';

export const urlRegex = generateUrlRegex();
export const passwordRegex = /^[a-zA-Z0-9]{3,30}$/
export const telefoneRegex = /\([0-9]{2}\) ([0-9]{4})-[0-9]{4}/
export const celularRegex = /\([0-9]{2}\) ([0-9]{4,5})-[0-9]{4}/
export const cpfRegex = /[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}/
export const cnpjRegex = /[0-9]{4}.[0-9]{4}.[0-9]{4}.[0-9]{4}/
