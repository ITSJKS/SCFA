def nextGreaterElement(arr):
    n = len(arr)
    res = []
    for i in range(n):
        found = False
        for j in range(i+1,n):
            if arr[j] > arr[i]:
                res.append(arr[j])
                found = True
                break
        if not found:
            res.append(-1)
    print(*res)