def nextGreaterElement(arr):
    n = len(arr)
    res = [-1]*n
    for i in range(1,n):
        if arr[i-1] < arr[i]:
            res[i-1] = arr[i]
        else:
            k = i
            while k < n :
                if arr[i-1] < arr[k]:
                    res[i-1] = arr[k]
                    break
                else:
                    k += 1
    print(*res)