def firstOccurrence(nums):
    # for i in len(nums):
    #     if nums[i] == '1':
    #         return nums[i]
    # return -1
    a=0
    b = len(arr)-1
    ans = float('inf')

    while(a <=b):
        mid  = (a+b)//2
        if nums[mid] == 1:
            ans  = min(ans,mid)
            b = mid -1
        else:
            a = mid+1
    if ans == float('inf'):
        return -1
    else:
        return ans