def trap(arr):

    left = []
    big = arr[0]
    for i in range(len(arr)):
        if arr[i] > big : 
            big = arr[i]
        left.append(big)

    right = []
    big = arr[-1]
    
    for i in range(len(arr) -1 , -1 , -1) :
        if arr[i] > big : 
            big = arr[i]
        right.append(big)
    right = right[::-1]
    ans = 0 

    for i in range(len(arr)):
        ans += max(min(right[i] , left[i]) - arr[i] , 0)
    # print(left)
    # print(right)
    return ans