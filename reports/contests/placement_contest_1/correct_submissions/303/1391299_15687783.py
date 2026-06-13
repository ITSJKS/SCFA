def nextGreaterElement(arr):

    n = len(arr)
    result = []

    for i in range(n):
        found = False
        for j in range(i+1, n):
            if arr[j] > arr[i]:
                found = True
                
                result.append(arr[j])
                break

        if not found:
            result.append(-1)

    print(*result)