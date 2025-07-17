import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Client, Account, ID, Models, Databases } from 'react-native-appwrite';
import React, { useState } from 'react';

let client: Client;
export let account: Account;
export let database: Databases;

client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)   // Your Project ID
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);  
 account= new Account(client); 
 database = new Databases(client);
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!
export const HABBITS_ID = process.env.EXPO_PUBLIC_APPWRITE_HABBITS_COLLECTION_ID!

