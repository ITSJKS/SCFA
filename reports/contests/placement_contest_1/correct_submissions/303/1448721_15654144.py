def nextGreaterElement(arr):

    ans = [-1] * len(arr)
    for i in range(len(arr)):
        for j in range(i , len(arr)):
            if arr[j] > arr[i]:
                ans[i] = arr[j]
                break
    print(*ans)