def nextGreaterElement(arr):
    n = len(arr)
    res = [-1]*n
    for i in range(n-1):
        for j in range(i, n):
            if arr[i] < arr[j]:
                res[i] = arr[j]
                
                break
            
    print(*res)