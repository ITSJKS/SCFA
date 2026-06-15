def nextGreaterElement(arr):
    n = len(arr)
    ans = []
    for i in range(n):
        for j in range(i+1, n):
            if arr[j] > arr[i]:
                ans.append(arr[j])
                break
        else:
            ans.append(-1)

    print(*ans)