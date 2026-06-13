def nextGreaterElement(arr):
    arr2 = []
    for i in range(0, len(arr)):
        for j in range(i+1, len(arr)):
            if arr[j]>arr[i]:
                arr2.append(arr[j])
                break
        else:
            arr2.append(-1)
    print(*arr2)