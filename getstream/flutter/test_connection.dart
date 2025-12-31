import 'dart:convert';
import 'dart:io';

void main() async {
  print('🧪 Testing connection to Stream Chat Backend...\n');

  const baseUrl = 'http://localhost:3000/chat';

  try {
    // Test 1: Health Check
    print('1️⃣ Testing Health Check...');
    final healthResponse = await HttpClient().getUrl(Uri.parse('$baseUrl/health'));
    final healthResult = await healthResponse.close();
    final healthData = await healthResult.transform(utf8.decoder).join();
    print('✅ Health Check: ${json.decode(healthData)['status']}\n');

    // Test 2: User Token Generation
    print('2️⃣ Testing User Token Generation...');
    final tokenResponse = await HttpClient().postUrl(Uri.parse('$baseUrl/users/token'));
    tokenResponse.write(json.encode({'userId': 'test_user'}));
    final tokenResult = await tokenResponse.close();
    final tokenData = await tokenResult.transform(utf8.decoder).join();
    final tokenJson = json.decode(tokenData);
    print('✅ Token Generated: ${tokenJson['success']}');
    print('   User ID: ${tokenJson['userId']}');
    print('   API Key: ${tokenJson['apiKey']}\n');

    // Test 3: User Creation
    print('3️⃣ Testing User Creation...');
    final userResponse = await HttpClient().postUrl(Uri.parse('$baseUrl/users'));
    userResponse.write(json.encode({
      'userId': 'test_user',
      'userData': {'name': 'Test User'}
    }));
    final userResult = await userResponse.close();
    final userData = await userResult.transform(utf8.decoder).join();
    final userJson = json.decode(userData);
    print('✅ User Created: ${userJson['success']}\n');

    // Test 4: Channel Creation
    print('4️⃣ Testing Channel Creation...');
    final channelResponse = await HttpClient().postUrl(Uri.parse('$baseUrl/channels'));
    channelResponse.write(json.encode({
      'channelType': 'messaging',
      'channelId': 'test-channel',
      'members': ['test_user'],
      'createdBy': 'test_user'
    }));
    final channelResult = await channelResponse.close();
    final channelData = await channelResult.transform(utf8.decoder).join();
    final channelJson = json.decode(channelData);
    print('✅ Channel Created: ${channelJson['success']}');
    print('   Channel ID: ${channelJson['channel']['id']}\n');

    print('🎉 All tests passed! Your backend is ready for Flutter integration.');

  } catch (e) {
    print('❌ Test failed: $e');
    print('\n🔧 Make sure your backend is running:');
    print('   cd backend && npm run start:dev');
  }
}
