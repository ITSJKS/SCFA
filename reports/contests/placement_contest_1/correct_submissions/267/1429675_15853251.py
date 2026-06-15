def trap(arr):
    left,right = 0,len(arr)-1
    left_sum,right_sum = 0 ,0
    water = 0
    while left<=right:
        if arr[left]<=arr[right]:
            if arr[left]>left_sum:
                left_sum = arr[left]
            else:
                water += left_sum - arr[left] 
            left+=1
        else:
            if arr[right]>right_sum:
                right_sum = arr[right]
            else:
                water += right_sum - arr[right] 
            right-=1
    return water