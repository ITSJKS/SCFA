def nextGreaterElement(arr):
    n = len(arr)
    ans = []
    for i in range(n):
        for j in range(i,n):
            found = False
            if arr[j]>arr[i]:
                ans.append(arr[j])
                found = True
                break
        if not found:
            ans.append(-1)

    print(*ans)