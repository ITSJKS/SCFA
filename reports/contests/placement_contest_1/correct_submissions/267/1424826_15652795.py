def trap(arr):

    maxLeft = [-1]
    maxRight = [-1]

    n = len(arr)
    for i in range(n):
        maxLeft.append(max(maxLeft[-1],arr[i]))
    # print(maxLeft)
    maxLeft = maxLeft[1:]
    # print(maxLeft)


    for i in range(n-1,-1,-1):
        maxRight.append(max(maxRight[-1],arr[i]))
    # print(maxRight)
    maxRight = maxRight[1:][::-1]
    # print(maxRight)

    trap = 0
    for i in range(n):
        trap += (min(maxLeft[i],maxRight[i]) - arr[i])

    return trap