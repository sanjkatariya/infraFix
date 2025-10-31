# File Upload Debugging Guide

## 🔍 Current Issue

The file appears as empty `{}` in the payload, but it should be a File object.

## ✅ What I Fixed

1. **Error Handling Bug**: Fixed `error.response.data?.includes is not a function`
2. **File Validation**: Added file type and size validation
3. **File Appending**: Ensure file is properly appended to FormData with filename
4. **FormData Logging**: Enhanced logging to verify file is included

## 🧪 How to Debug

### Step 1: Check Browser Console

When you select a file, you should see:
```
📎 File selected: { name: 'image.jpg', type: 'image/jpeg', size: 123456, ... }
```

When you submit, you should see:
```
📤 Submitting complaint:
  Email: ...
  Description: ...
  Location: ...
  File: image.jpg image/jpeg 123.45 KB
  FormData verification:
    email: ...
    description: ...
    location: ...
    file: File(image.jpg, image/jpeg, 123456 bytes)
```

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Submit complaint
3. Find the POST request to `/api-proxy/complains`
4. Click on it
5. Go to "Payload" or "Request" tab
6. You should see:
   - `email`: text
   - `description`: text
   - `location`: text
   - `file`: [File object should appear here]

### Step 3: Verify File Input

Check if file input is working:
```javascript
// In browser console, run:
const input = document.getElementById('photo-upload');
input.addEventListener('change', (e) => {
  console.log('File input changed:', e.target.files);
});
```

## 🐛 Common Issues

### Issue 1: File is null

**Symptoms:** `selectedFile` is null when submitting

**Fix:** 
- Make sure file input is properly connected to `handleImageUpload`
- Check if file input has `required` attribute
- Verify file input ID is `photo-upload`

### Issue 2: File appears empty

**Symptoms:** FormData shows `file: {}`

**Possible causes:**
- File input was reset before form submission
- File was cleared by state update
- File input value was reset

**Fix:**
- Don't reset file input until after successful submission
- Make sure `selectedFile` state persists until form submit

### Issue 3: File type not supported

**Symptoms:** Only certain file types work

**Fix:**
- Check `accept="image/*"` on file input
- Verify backend accepts the file type
- Check file size limits

## 📋 Checklist

- [ ] File is selected (check console for "File selected" log)
- [ ] `selectedFile` state is set (check in React DevTools)
- [ ] FormData includes file (check "FormData verification" log)
- [ ] File size is reasonable (< 10MB)
- [ ] File type is image (image/jpeg, image/png, etc.)
- [ ] Network request shows file in payload

## 🔧 Manual Test

1. **Select a file** - should see file preview
2. **Check console** - should see "File selected" log
3. **Fill form** - description, location
4. **Submit** - should see "FormData verification" log
5. **Check Network tab** - should see file in request

## 🚨 If Still Not Working

If file is still empty:

1. **Check `selectedFile` state:**
   ```javascript
   // Add this before form submission
   console.log('Selected file state:', selectedFile);
   console.log('Is File?', selectedFile instanceof File);
   ```

2. **Manually create FormData:**
   ```javascript
   // Test in browser console
   const testFormData = new FormData();
   testFormData.append('test', 'value');
   testFormData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
   console.log(Array.from(testFormData.entries()));
   ```

3. **Check if file input is resetting:**
   - Look for any code that calls `fileInput.value = ''`
   - Check if state is being cleared accidentally

## 📝 Network Issue (Separate)

The `ETIMEDOUT` error is a **network connectivity issue**, not a file upload issue.

**This needs to be fixed separately:**
- Test if API server is accessible
- Check firewall/network settings
- Verify server is running
- Compare with Postman settings

The file upload code is correct, but it can't reach the server to upload.

