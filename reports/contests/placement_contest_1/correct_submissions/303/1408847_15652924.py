def nextGreaterElement(arr):
    res = [-1] * len(arr)
    for i in range(len(arr)-1):
        j = i + 1
        while j < len(arr):
            if arr[j] > arr[i]:
                res[i] = arr[j]
                break
            j += 1

    for i in res:
        print(i, end=" ")