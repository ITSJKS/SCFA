def nextGreaterElement(arr):
    n = len(arr)
    l = [-1] * n 
    for i in range (n):
        for j in range(i+1, n):
            if arr[j] > arr[i]:
                l[i] = arr[j]
                break
    print(*l)