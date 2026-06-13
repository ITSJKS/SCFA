def nextGreaterElement(arr):
    n = []

    for i in range(len(arr)):
        found = False

        for j in range(i + 1, len(arr)):
            if arr[j] > arr[i]:
                n.append(arr[j])
                found = True
                break

        if not found:
            n.append(-1)

    print(*n)