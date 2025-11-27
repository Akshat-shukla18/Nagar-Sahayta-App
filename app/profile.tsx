import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import { updateProfile } from 'firebase/auth';

import i18n from './i18n';

interface UserProfile {
  userId: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
}

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      fetchProfile();
    }
  }, [user]);

  const getInitial = () => {
    return user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';
  };

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://172.20.10.8:5000/api/users/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setGender(data.gender || '');
        setAddress(data.address || '');
        setPhone(data.phoneNumber || '');
      } else if (response.status === 404) {
        setProfile({ userId: user.uid });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert(i18n.t('profile.error'), i18n.t('profile.error'));
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const saveProfile = async () => {
    if (!user) return;

    if (phone && !validatePhone(phone)) {
      Alert.alert(i18n.t('profile.invalidPhone'), i18n.t('profile.invalidPhoneMessage'));
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        gender: gender || null,
        address: address || null,
        phoneNumber: phone || null,
      };

      const response = await fetch(`http://172.20.10.8:5000/api/users/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        if (user.displayName !== name) {
          await updateProfile(user, { displayName: name });
        }
        Alert.alert(i18n.t('profile.success'), i18n.t('profile.success'));
        fetchProfile();
        router.replace('/dashboard');
      } else {
        Alert.alert(i18n.t('profile.error'), i18n.t('profile.error'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(i18n.t('profile.error'), i18n.t('profile.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{i18n.t('profile.title')}</Text>

      {/* Avatar with Initial */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={styles.bigAvatar}>
          <Text style={styles.bigInitial}>{getInitial()}</Text>
        </View>
      </View>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>{i18n.t('profile.name')}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={i18n.t('profile.name')}
        />
      </View>

      {/* Email (Read-only) */}
      <View style={styles.field}>
        <Text style={styles.label}>{i18n.t('profile.email')}</Text>
        <Text style={styles.readOnlyText}>{email}</Text>
      </View>

      {/* Phone */}
      <View style={styles.field}>
        <Text style={styles.label}>{i18n.t('profile.phoneNumber')}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder={i18n.t('profile.phoneNumber')}
          keyboardType="phone-pad"
        />
      </View>

      {/* Gender */}
      <View style={styles.field}>
        <Text style={styles.label}>{i18n.t('profile.gender')}</Text>
        <View style={styles.genderContainer}>
          {[
            i18n.t('profile.male'),
            i18n.t('profile.female'),
            i18n.t('profile.other'),
          ].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.genderButton, gender === option && styles.selectedGender]}
              onPress={() => setGender(option)}
            >
              <Text style={[styles.genderText, gender === option && styles.selectedGenderText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Address */}
      <View style={styles.field}>
        <Text style={styles.label}>{i18n.t('profile.address')}</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={address}
          onChangeText={setAddress}
          placeholder={i18n.t('profile.address')}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.disabledButton]}
        onPress={saveProfile}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? i18n.t('profile.saving') : i18n.t('profile.saveProfile')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DCF4F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  bigAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#004080',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bigInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#666',
    padding: 10,
    backgroundColor: '#9CB3B8',
    borderRadius: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#11434F',
    borderColor: '#007bff',
  },
  genderText: {
    fontSize: 16,
    color: '#333',
  },
  selectedGenderText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
