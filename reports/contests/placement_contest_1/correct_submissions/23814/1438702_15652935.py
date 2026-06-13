def firstOccurrence(nums):
    low = 0
    high = len(nums)-1
    ans = float('inf')
    while(low<=high):
        mid = (low + high)//2
        # print(mid)
        if nums[mid]==1:
            ans = min(ans,mid)
            high = mid -1
        else:
            low = mid + 1
    if ans == float('inf'):
        return -1
    else: return ans