def nextGreatestLetter(letters, target):
    l = "abcdefghijklmnopqrstuvwxyz"
    arr = []
    arr2 = []
    t = 0
    for ch in l:
        arr.append(ch)
    
    for i in range(len(arr)):
        if arr[i] in letters:
            arr2.append(i)
        if arr[i]==target:
            t = i
    
    ans = arr[arr2[0]]
    
    for j in arr2:
        if j>t:
            ans = arr[j]
            break
    return ans