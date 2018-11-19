// @flow
import * as React from 'react';
import prettyFormat from 'pretty-format';
import { ErrorWithStack, createLibraryNotSupportedError } from './errors';

const filterNodeByType = (node, type) => node.type === type;

const filterNodeByName = (node, name) =>
  typeof node.type !== 'string' &&
  (node.type.displayName === name || node.type.name === name);

const getNodeByText = (node, text) => {
  try {
    // eslint-disable-next-line
    const { Text, TextInput } = require('react-native');
    return (
      (filterNodeByType(node, Text) || filterNodeByType(node, TextInput)) &&
      (typeof text === 'string'
        ? text === node.props.children
        : text.test(node.props.children))
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const prepareErrorMessage = error =>
  // Strip info about custom predicate
  error.message.replace(/ matching custom predicate[^]*/gm, '');

// TODO: deprecate getByName(string | type) in favor of getByType(type)
export const getByName = (instance: ReactTestInstance) =>
  function getByNameFn(name: string | React.ComponentType<*>) {
    try {
      return typeof name === 'string'
        ? instance.find(node => filterNodeByName(node, name))
        : instance.findByType(name);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByNameFn);
    }
  };

export const getByType = (instance: ReactTestInstance) =>
  function getByTypeFn(type: React.ComponentType<*>) {
    try {
      return instance.findByType(type);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTypeFn);
    }
  };

export const getByText = (instance: ReactTestInstance) =>
  function getByTextFn(text: string | RegExp) {
    try {
      return instance.find(node => getNodeByText(node, text));
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTextFn);
    }
  };

export const getByProps = (instance: ReactTestInstance) =>
  function getByPropsFn(props: { [propName: string]: any }) {
    try {
      return instance.findByProps(props);
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByPropsFn);
    }
  };

export const getByTestId = (instance: ReactTestInstance) =>
  function getByTestIdFn(testID: string) {
    try {
      return instance.findByProps({ testID });
    } catch (error) {
      throw new ErrorWithStack(prepareErrorMessage(error), getByTestIdFn);
    }
  };

// TODO: deprecate getAllByName(string | type) in favor of getAllByType(type)
export const getAllByName = (instance: ReactTestInstance) =>
  function getAllByNameFn(name: string | React.ComponentType<*>) {
    const results =
      typeof name === 'string'
        ? instance.findAll(node => filterNodeByName(node, name))
        : instance.findAllByType(name);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByNameFn);
    }
    return results;
  };

export const getAllByType = (instance: ReactTestInstance) =>
  function getAllByTypeFn(type: React.ComponentType<*>) {
    const results = instance.findAllByType(type);
    if (results.length === 0) {
      throw new ErrorWithStack('No instances found', getAllByTypeFn);
    }
    return results;
  };

export const getAllByText = (instance: ReactTestInstance) =>
  function getAllByTextFn(text: string | RegExp) {
    const results = instance.findAll(node => getNodeByText(node, text));
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with text: ${String(text)}`,
        getAllByTextFn
      );
    }
    return results;
  };

export const getAllByProps = (instance: ReactTestInstance) =>
  function getAllByPropsFn(props: { [propName: string]: any }) {
    const results = instance.findAllByProps(props);
    if (results.length === 0) {
      throw new ErrorWithStack(
        `No instances found with props:\n${prettyFormat(props)}`,
        getAllByPropsFn
      );
    }
    return results;
  };

export const getByAPI = (instance: ReactTestInstance) => ({
  getByTestId: getByTestId(instance),
  getByName: getByName(instance),
  getByType: getByType(instance),
  getByText: getByText(instance),
  getByProps: getByProps(instance),
  getAllByName: getAllByName(instance),
  getAllByType: getAllByType(instance),
  getAllByText: getAllByText(instance),
  getAllByProps: getAllByProps(instance),
});
