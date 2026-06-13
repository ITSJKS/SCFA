def nextGreaterElement(arr):
    n = len(arr)

    temp = [-1]*n 

    for i in range(n):
        for j in range(i,n):
            if arr[j] > arr[i]:
                temp[i] = arr[j]
                break
        # print(temp)
    # print("======")

    print(*temp)
    # return temp