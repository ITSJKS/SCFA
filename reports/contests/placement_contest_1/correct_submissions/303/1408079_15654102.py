def nextGreaterElement(arr):
    n = len(arr)
    res = [-1]*n

    for i in range(n):
        for j in range(i+1,n):
            if arr[j] > arr[i]:
                res[i] = arr[j]
                break

    print(*res)