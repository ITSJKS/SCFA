def nextGreaterElement(arr):
    arrRes = [-1]*len(arr)
    for i in range(len(arr)):
        curr = i
        for j in range(i+1,len(arr)):
            if arr[i]<arr[j]:
                arrRes[i] = arr[j]
                break
                
    print(*arrRes)