def nextGreaterElement(arr):
    n = len(arr)
    nums=[-1] *n
    for i in range(n-1):
        j = i+1
        while j > i and j<=n-1:
            if arr[j]>arr[i]:
                nums[i] = arr[j]
                break
            j+=1
    print(*nums)